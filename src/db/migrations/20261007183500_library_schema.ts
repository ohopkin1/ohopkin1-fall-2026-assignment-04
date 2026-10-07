import { Kysely } from 'kysely';

export async function up(db: Kysely<any>): Promise<void> {
  // 1. Borrowers table (references existing users table, 1-to-1 unique relationship)
  await db.schema
    .createTable('borrowers')
    .addColumn('borrower_id', 'serial', (col) => col.primaryKey())
    .addColumn('user_id', 'integer', (col) =>
      col.references('users.id').onDelete('cascade').unique().notNull()
    )
    .execute();

  // 2. Books table
  await db.schema
    .createTable('books')
    .addColumn('book_id', 'serial', (col) => col.primaryKey())
    .addColumn('title', 'varchar(255)', (col) => col.notNull())
    .addColumn('isbn', 'varchar(255)', (col) => col.notNull())
    .addColumn('publication_year', 'integer', (col) => col.notNull())
    .execute();

  // 3. Authors table
  await db.schema
    .createTable('authors')
    .addColumn('author_id', 'serial', (col) => col.primaryKey())
    .addColumn('name', 'varchar(255)', (col) => col.notNull())
    .execute();

  // 4. Genres table
  await db.schema
    .createTable('genres')
    .addColumn('genre_id', 'serial', (col) => col.primaryKey())
    .addColumn('name', 'varchar(255)', (col) => col.notNull())
    .execute();

  // 5. Book Authors junction table (M:N between books and authors)
  await db.schema
    .createTable('book_authors')
    .addColumn('book_author_id', 'serial', (col) => col.primaryKey())
    .addColumn('book_id', 'integer', (col) =>
      col.references('books.book_id').onDelete('cascade').notNull()
    )
    .addColumn('author_id', 'integer', (col) =>
      col.references('authors.author_id').onDelete('cascade').notNull()
    )
    .execute();

  // 6. Book Genres junction table (M:N between books and genres)
  await db.schema
    .createTable('book_genres')
    .addColumn('book_genre_id', 'serial', (col) => col.primaryKey())
    .addColumn('book_id', 'integer', (col) =>
      col.references('books.book_id').onDelete('cascade').notNull()
    )
    .addColumn('genre_id', 'integer', (col) =>
      col.references('genres.genre_id').onDelete('cascade').notNull()
    )
    .execute();

  // 7. Loans table (references borrowers and books)
  await db.schema
    .createTable('loans')
    .addColumn('loan_id', 'serial', (col) => col.primaryKey())
    .addColumn('borrower_id', 'integer', (col) =>
      col.references('borrowers.borrower_id').onDelete('cascade').notNull()
    )
    .addColumn('book_id', 'integer', (col) =>
      col.references('books.book_id').onDelete('cascade').notNull()
    )
    .execute();
}

export async function down(db: Kysely<any>): Promise<void> {
  // Drop tables in reverse dependency order
  await db.schema.dropTable('loans').execute();
  await db.schema.dropTable('book_genres').execute();
  await db.schema.dropTable('book_authors').execute();
  await db.schema.dropTable('genres').execute();
  await db.schema.dropTable('authors').execute();
  await db.schema.dropTable('books').execute();
  await db.schema.dropTable('borrowers').execute();
}
