create extension if not exists pgcrypto;

do $$
begin
  if not exists (select 1 from pg_type where typname = 'document_status') then
    create type document_status as enum ('pending', 'approved', 'rejected');
  end if;
end $$;

create table if not exists documents (
  id uuid primary key default gen_random_uuid(),
  title varchar(255) not null,
  school varchar(100) not null,
  department varchar(100) not null,
  subject varchar(100) not null,
  file_type varchar(20) not null,
  file_size_bytes bigint not null check (file_size_bytes > 0),
  s3_key varchar(512) not null unique,
  status document_status not null default 'pending',
  download_count integer not null default 0,
  uploader_name varchar(255),
  content_index text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists documents_status_idx on documents (status);
create index if not exists documents_school_department_subject_idx on documents (school, department, subject);
create index if not exists documents_created_at_idx on documents (created_at desc);
