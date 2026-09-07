CREATE TABLE members (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(50) NOT NULL,
    student_id VARCHAR(7) NOT NULL UNIQUE,
    email VARCHAR(255) NOT NULL UNIQUE,
    grade SMALLINT NOT NULL,
    position VARCHAR(50),
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE items (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description VARCHAR(255) NOT NULL,
    storage_location VARCHAR(100) NOT NULL,
    quantity SMALLINT NOT NULL,
    is_disposable BOOLEAN NOT NULL DEFAULT FALSE,
    is_rentable BOOLEAN NOT NULL DEFAULT FALSE,
    renter_id BIGINT,
    rented_at TIMESTAMP,

    CONSTRAINT fk_items_renter
        FOREIGN KEY (renter_id)
        REFERENCES members(id)
        ON DELETE SET NULL
);

CREATE TABLE item_rental_histories (
    id BIGSERIAL PRIMARY KEY,
    item_id BIGINT NOT NULL,
    renter_id BIGINT NOT NULL,
    rented_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    returned_at TIMESTAMP,

    CONSTRAINT fk_history_item
        FOREIGN KEY (item_id)
        REFERENCES items(id)
        ON DELETE CASCADE,

    CONSTRAINT fk_history_renter
        FOREIGN KEY (renter_id)
        REFERENCES members(id)
        ON DELETE CASCADE
);

CREATE TABLE news (
    id BIGSERIAL PRIMARY KEY,
    title VARCHAR(100) NOT NULL,
    content TEXT NOT NULL,
    thumbnail_path VARCHAR(255),
    category VARCHAR(30) NOT NULL,
    is_published BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP
);

CREATE TABLE technologies (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(50) NOT NULL,
    description VARCHAR(255) NOT NULL
);

CREATE TABLE member_technologies (
    member_id BIGINT NOT NULL,
    technology_id BIGINT NOT NULL,

    PRIMARY KEY (member_id, technology_id),

    CONSTRAINT fk_member_technologies_member
        FOREIGN KEY (member_id)
        REFERENCES members(id)
        ON DELETE CASCADE,

    CONSTRAINT fk_member_technologies_technology
        FOREIGN KEY (technology_id)
        REFERENCES technologies(id)
        ON DELETE CASCADE
);