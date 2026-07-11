-- Add SUPER_ADMIN to the Role enum for the admin permission-tier split.
ALTER TYPE "Role" ADD VALUE 'SUPER_ADMIN';
