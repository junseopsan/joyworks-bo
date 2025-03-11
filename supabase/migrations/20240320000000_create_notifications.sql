create table notifications (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  type text not null,
  title text not null,
  content text not null,
  link text not null,
  read boolean default false not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- RLS 정책 설정
alter table notifications enable row level security;

create policy "사용자는 자신의 알림만 볼 수 있음"
  on notifications for select
  using (auth.uid() = user_id);

create policy "시스템은 알림을 생성할 수 있음"
  on notifications for insert
  to service_role
  with check (true);

create policy "사용자는 자신의 알림을 읽음 처리할 수 있음"
  on notifications for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "사용자는 자신의 알림을 삭제할 수 있음"
  on notifications for delete
  using (auth.uid() = user_id); 