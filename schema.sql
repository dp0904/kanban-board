CREATE TABLE IF NOT EXISTS tasks (
    id serial primary key,
    title varchar(255) not null,
    description text,
    status varchar(50) default 'todo',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO tasks(title, description, status) 
VALUES 
('Setup Docker Postgres', 'Spin up database container with docker-compose', 'done'), ('Connect express to postgres', 'Configure pg pool client in node', 'in-progress'),
('Build REST Endpoints', 'Replace in-memory tasks array with db queries', 'todo');
