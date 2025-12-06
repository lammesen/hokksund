-- Enable RLS on all tables by default
alter default privileges in schema public grant all on tables to postgres, anon, authenticated, service_role;

-- Profiles table (extends auth.users)
create table public.profiles (
  id uuid references auth.users on delete cascade primary key,
  email text not null,
  full_name text,
  role text not null default 'parent' check (role in ('parent', 'staff', 'admin')),
  language text default 'no',
  created_at timestamptz default now()
);
alter table public.profiles enable row level security;

-- Children table
create table public.children (
  id uuid primary key default gen_random_uuid(),
  first_name text not null,
  last_name text not null,
  date_of_birth date,
  group_name text,
  photo_url text,
  created_at timestamptz default now()
);
alter table public.children enable row level security;

-- Parent-child junction table
create table public.parent_child (
  parent_id uuid references public.profiles on delete cascade,
  child_id uuid references public.children on delete cascade,
  primary key (parent_id, child_id)
);
alter table public.parent_child enable row level security;

-- Attendance records
create table public.attendance (
  id uuid primary key default gen_random_uuid(),
  child_id uuid references public.children on delete cascade not null,
  check_in_time timestamptz not null default now(),
  check_in_by uuid references public.profiles,
  check_out_time timestamptz,
  check_out_by uuid references public.profiles
);
alter table public.attendance enable row level security;

-- Index for efficient date-range queries on attendance
create index attendance_check_in_time_idx on public.attendance (check_in_time);

-- Emergency contacts
create table public.contacts (
  id uuid primary key default gen_random_uuid(),
  child_id uuid references public.children on delete cascade not null,
  contact_name text not null,
  relationship text,
  phone text,
  email text,
  is_primary boolean default false
);
alter table public.contacts enable row level security;

-- Helper function: check if current user is staff or admin
create or replace function public.is_staff_or_admin()
returns boolean as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid() and role in ('staff', 'admin')
  );
$$ language sql security definer;

-- Helper function: check if user has access to specific child
create or replace function public.has_child_access(child_uuid uuid)
returns boolean as $$
  select
    public.is_staff_or_admin()
    or exists (
      select 1 from public.parent_child
      where parent_id = auth.uid() and child_id = child_uuid
    );
$$ language sql security definer;

-- RLS Policies for profiles
create policy "Users can view own profile" on profiles
  for select using (auth.uid() = id);
create policy "Staff can view all profiles" on profiles
  for select using (public.is_staff_or_admin());
-- Users can only update their own profile, but cannot change their role
create policy "Users can update own profile" on profiles
  for update using (auth.uid() = id)
  with check (auth.uid() = id and role = (select role from profiles where id = auth.uid()));
-- Admins can update any profile, but cannot escalate roles to admin
-- (admin role changes must be done via direct database access)
create policy "Admins can update any profile" on profiles
  for update using (exists (select 1 from profiles where id = auth.uid() and role = 'admin'))
  with check (
    -- Allow update if role is not being changed to 'admin'
    -- OR if the target user was already an admin (preserve existing admins)
    role != 'admin' or (select role from profiles where id = profiles.id) = 'admin'
  );

-- RLS Policies for children
create policy "Users can view accessible children" on children
  for select using (public.has_child_access(id));
create policy "Staff can insert children" on children
  for insert with check (public.is_staff_or_admin());
create policy "Staff can update children" on children
  for update using (public.is_staff_or_admin());
create policy "Staff can delete children" on children
  for delete using (public.is_staff_or_admin());

-- RLS Policies for parent_child
create policy "Users can view own relations" on parent_child
  for select using (parent_id = auth.uid() or public.is_staff_or_admin());
create policy "Staff can manage relations" on parent_child
  for all using (public.is_staff_or_admin());

-- RLS Policies for attendance
create policy "Users can view accessible attendance" on attendance
  for select using (public.has_child_access(child_id));
create policy "Users can check in accessible children" on attendance
  for insert with check (public.has_child_access(child_id));
create policy "Users can check out accessible children" on attendance
  for update using (public.has_child_access(child_id));

-- RLS Policies for contacts
create policy "Users can view accessible contacts" on contacts
  for select using (public.has_child_access(child_id));
create policy "Staff can manage contacts" on contacts
  for all using (public.is_staff_or_admin());

-- Trigger: auto-create profile on user signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, full_name)
  values (new.id, new.email, new.raw_user_meta_data->>'full_name');
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
