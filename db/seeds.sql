INSERT INTO department 
    (name)
VALUES
    ('Sales'),
    ('Customer Service'),
    ('Finance'),
    ('Legal');

INSERT INTO role
    (title, salary, department_id)
VALUES
    ('Assistant Manager', 80000, 1),
    ('Salesperson', 50000, 2),
    ('Advertising Consultant', 100000, 3),
    ('Attorney', 250000, 4);

INSERT INTO employee
    (first_name, last_name, role_id, manager_id)
VALUES
    ('Joe', 'Malonzo', 1, 3),
    ('Joseph', 'Malonz', 2, 4),
    ('Jose', 'Malon', 2, 1),
    ('Josep', 'Alonzo', 3, 5);