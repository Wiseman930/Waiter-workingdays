CREATE TABLE IF NOT EXISTS weekly_days (
    id SERIAL PRIMARY KEY,
    day text NOT NULL
);
CREATE TABLE working_waiters(
    id SERIAL PRIMARY KEY,
    names text NOT NULL,
    code TEXT NOT NULL
);

CREATE TABLE available_days(
    id serial not null primary key,
    working_days INT NOT NULL,
    waiter_id INT NOT NULL,
    FOREIGN KEY (waiter_id) REFERENCES working_waiters(id) ON DELETE CASCADE,
    FOREIGN KEY (working_days) REFERENCES weekly_days(id) ON DELETE CASCADE
);

INSERT INTO weekly_days (day) VALUES
('Monday'),
('Tuesday'),
('Wednesday'),
('Thursday'),
('Friday'),
('Saturday'),
('Sunday');

