-- Users
CREATE TABLE users (
    id              SERIAL PRIMARY KEY,
    username        VARCHAR(30)  NOT NULL UNIQUE,
    email           VARCHAR(255) NOT NULL UNIQUE,
    password_hash   TEXT         NOT NULL,
    avatar_url      TEXT,
    bio             TEXT,
    created_at      TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

CREATE TABLE refresh_tokens (
    id            SERIAL PRIMARY KEY,
    user_id       INTEGER      NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    token_hash    VARCHAR(128) NOT NULL UNIQUE,
    expires_at    TIMESTAMPTZ  NOT NULL,
    revoked       BOOLEAN      NOT NULL DEFAULT FALSE,
    created_at    TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);
CREATE INDEX idx_refresh_tokens_token_hash ON refresh_tokens(token_hash);
CREATE INDEX idx_refresh_tokens_user_id    ON refresh_tokens(user_id);

CREATE TABLE nests (
    id            SERIAL PRIMARY KEY,
    slug          VARCHAR(50)  NOT NULL UNIQUE,
    name          VARCHAR(100) NOT NULL,
    description   TEXT,
    creator_id    INTEGER      NOT NULL REFERENCES users(id) ON DELETE SET NULL,
    member_count  INTEGER      NOT NULL DEFAULT 1,
    created_at    TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

CREATE TABLE nest_members (
    user_id    INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    nest_id    INTEGER NOT NULL REFERENCES nests(id) ON DELETE CASCADE,
    role       VARCHAR(10) NOT NULL DEFAULT 'member' CHECK (role IN ('member','mod','admin')),
    joined_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    PRIMARY KEY (user_id, nest_id)
);
CREATE INDEX idx_nest_members_nest_id ON nest_members(nest_id);

CREATE TABLE posts (
    id         SERIAL PRIMARY KEY,
    nest_id    INTEGER      NOT NULL REFERENCES nests(id) ON DELETE CASCADE,
    author_id  INTEGER      NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    title      VARCHAR(300) NOT NULL,
    body       TEXT,
    type       VARCHAR(10)  NOT NULL DEFAULT 'text' CHECK (type IN ('text','link','image')),
    url        TEXT,
    score      INTEGER      NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);
CREATE INDEX idx_posts_nest_id       ON posts(nest_id);
CREATE INDEX idx_posts_author_id    ON posts(author_id);
CREATE INDEX idx_posts_created_at   ON posts(created_at);

CREATE TABLE votes (
    user_id  INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    post_id  INTEGER NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
    value    SMALLINT NOT NULL CHECK (value IN (-1, 1)),
    PRIMARY KEY (user_id, post_id)
);

CREATE TABLE comments (
    id         SERIAL PRIMARY KEY,
    post_id    INTEGER      NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
    author_id  INTEGER      NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    parent_id  INTEGER      REFERENCES comments(id) ON DELETE CASCADE,
    body       TEXT         NOT NULL,
    score      INTEGER      NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);
CREATE INDEX idx_comments_post_id    ON comments(post_id);
CREATE INDEX idx_comments_parent_id  ON comments(parent_id);

CREATE TABLE comment_votes (
    user_id    INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    comment_id INTEGER NOT NULL REFERENCES comments(id) ON DELETE CASCADE,
    value      SMALLINT NOT NULL CHECK (value IN (-1, 1)),
    PRIMARY KEY (user_id, comment_id)
);

CREATE TABLE chat_messages (
    id         SERIAL PRIMARY KEY,
    nest_id    INTEGER      NOT NULL REFERENCES nests(id) ON DELETE CASCADE,
    sender_id  INTEGER      NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    body       TEXT         NOT NULL,
    created_at TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);
CREATE INDEX idx_chat_messages_nest_id    ON chat_messages(nest_id);
CREATE INDEX idx_chat_messages_created_at ON chat_messages(created_at);

CREATE TABLE notifications (
    id         SERIAL PRIMARY KEY,
    user_id    INTEGER      NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    type       VARCHAR(30)  NOT NULL,
    ref_id     INTEGER,
    seen       BOOLEAN      NOT NULL DEFAULT FALSE,
    created_at TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);
CREATE INDEX idx_notifications_user_id        ON notifications(user_id);
CREATE INDEX idx_notifications_user_seen      ON notifications(user_id, seen);