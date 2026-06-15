-- MathGameHS Phase 2 schema (content pipeline; not required for portal V1 runtime)

CREATE TYPE question_status AS ENUM ('draft', 'approved', 'retired');
CREATE TYPE difficulty_level AS ENUM ('NB', 'TH', 'VD', 'VDC');

CREATE TABLE questions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  part SMALLINT NOT NULL CHECK (part BETWEEN 1 AND 3),
  grade SMALLINT NOT NULL CHECK (grade BETWEEN 10 AND 12),
  topic_code VARCHAR(64) NOT NULL,
  difficulty difficulty_level NOT NULL,
  matrix_slot VARCHAR(16) NOT NULL,
  context_text TEXT,
  stem_latex TEXT NOT NULL,
  image_url TEXT,
  explanation_latex TEXT,
  source VARCHAR(128),
  locale CHAR(2) NOT NULL DEFAULT 'vi',
  status question_status NOT NULL DEFAULT 'draft',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE question_options (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  question_id UUID NOT NULL REFERENCES questions(id) ON DELETE CASCADE,
  label CHAR(1) NOT NULL CHECK (label IN ('A', 'B', 'C', 'D')),
  content_latex TEXT NOT NULL,
  is_correct BOOLEAN NOT NULL DEFAULT false,
  UNIQUE (question_id, label)
);

CREATE TABLE question_sub_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  question_id UUID NOT NULL REFERENCES questions(id) ON DELETE CASCADE,
  sub_label CHAR(1) NOT NULL CHECK (sub_label IN ('a', 'b', 'c', 'd')),
  statement_latex TEXT NOT NULL,
  is_true BOOLEAN NOT NULL,
  explanation_latex TEXT,
  UNIQUE (question_id, sub_label)
);

CREATE TABLE question_short_answers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  question_id UUID NOT NULL REFERENCES questions(id) ON DELETE CASCADE,
  answer_text VARCHAR(64) NOT NULL,
  answer_numeric DECIMAL,
  tolerance DECIMAL NOT NULL DEFAULT 0
);

CREATE TABLE exam_matrix_slots (
  slot_code VARCHAR(16) PRIMARY KEY,
  part SMALLINT NOT NULL,
  order_no SMALLINT NOT NULL,
  grade SMALLINT,
  topic_code VARCHAR(64),
  difficulty difficulty_level
);

CREATE TABLE exams (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  exam_code VARCHAR(8),
  exam_year SMALLINT,
  exam_type VARCHAR(32) NOT NULL DEFAULT 'generated',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE exam_questions (
  exam_id UUID NOT NULL REFERENCES exams(id) ON DELETE CASCADE,
  question_id UUID NOT NULL REFERENCES questions(id),
  order_no SMALLINT NOT NULL,
  PRIMARY KEY (exam_id, order_no)
);

CREATE TABLE moderation_queue (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  payload_json JSONB NOT NULL,
  target_part SMALLINT,
  target_slot VARCHAR(16),
  ai_model VARCHAR(64),
  status VARCHAR(16) NOT NULL DEFAULT 'pending',
  reviewer_note TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Phase 2 optional: student accounts (not used in portal V1)
-- CREATE TABLE users (...);
-- CREATE TABLE exam_sessions (...);
-- CREATE TABLE student_answers (...);
