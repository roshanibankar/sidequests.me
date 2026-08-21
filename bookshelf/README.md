# My Bookshelf


## Project structure

```
prisma/schema.prisma      Book model
prisma/seed.ts             your Booklist data
src/app/page.tsx           the shelf (home page)
src/app/login/page.tsx     admin login
src/app/add/page.tsx       add/edit form (protected)
src/app/api/books/         CRUD API for books
src/app/api/upload/        cover image upload
src/app/api/auth/          login/logout/session-check
src/components/            BookSpine, Shelf, TypeTabs, GenreFilter, BookModal
src/middleware.ts          protects /add route
```
