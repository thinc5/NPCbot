-- Up
CREATE TABLE IF NOT EXISTS RegisteredChannels (
    channel_id INTEGER PRIMARY KEY AUTOINCREMENT,
    bot_enabled BOOLEAN NOT NULL
);

-- INSERT INTO RegisteredChannels (
--     channel_id,
--     bot_enabled
-- ) VALUES (
--     1,
--     "TRUE"
-- );

-- Down
