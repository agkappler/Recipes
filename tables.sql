
CREATE TABLE IF NOT EXISTS users (
	user_id SERIAL PRIMARY KEY,
	email text  NOT NULL,
	password text NOT NULL
);

CREATE TABLE IF NOT EXISTS files (
  file_id SERIAL PRIMARY KEY,
  uu_id TEXT NOT NULL,
  filename TEXT NOT NULL,
  content_type TEXT,
  size_bytes BIGINT,
  file_role INTEGER NOT NULL
);

ALTER TABLE users ADD CONSTRAINT uq_users_email UNIQUE (email);


