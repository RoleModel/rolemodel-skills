# Encrypting databases


## Overview 

If you’re storing sensitive data (particularly private user or medical data) you’ll probably need to encrypt that data to decrease the risk of theft or leaks. 

There are two main approaches to encrypting your data:

- Encrypting data using your application code (Application level)
- Native encryption of the entire database (Database engine level)

This article is concerned with encrypting the data where it is stored (also know as “encryption at rest”), and while it is in use (“transactional encryption”) but you should also consider protecting your data while it is “in motion” by (for example) encrypting your database connections using SSL/TLS. 

While Cloud 66 doesn’t natively support full database encryption (TDE), there are several options available for encrypting your data - see below.

## Data encryption via the application

In this approach, your application would encrypt some (or all) of the data before storing it in the database structure, and decrypt it when it is retrieved. Most popular frameworks have plugins or extensions that can handle this for you.

Some examples are:

- [attr\_encrypted](https://github.com/attr-encrypted/attr_encrypted) for Ruby
- Node’s built-in [Crypto library](https://nodejs.org/api/crypto/)
- [pyca/cryptography](https://cryptography.io/en/latest/) for Python

The main advantage of this approach is that your database architecture and structure don’t need to be completely changed - you simply encrypt sensitive data as you store it and decrypt it as you retrieve it. This also allows you to only encrypt selected data and to leave the rest of your database unencrypted. 

The main drawbacks of this approach are that it requires development time, and can be prone to leaks and errors (because it relies on manual implementation). 

## Native database encryption

In this approach, the database engine natively handles all of the encryption and decryption processes, and your application simply queries the database using secure credentials of some kind. This is often called Transparent Data Encryption (TDE).

Many popular database engines offer this feature, but in most cases it is only available in the paid version. For example:

- [MySQL Enterprise](https://www.mysql.com/products/enterprise/encryption/) Encryption
- [MongoDB](https://docs.mongodb.com/manual/core/security-encryption-at-rest/) Encryption at Rest
- [Redis](https://redislabs.com/blog/securing-redis-with-redis-enterprise-for-compliance-requirements/) Encryption

Some engines do support native encryption in their free versions, but these are increasingly rare and are often incomplete or require significant extra configuration. For example:

- [Postgres](https://www.postgresql.org/docs/10/encryption-options/)
- [MariaDB](https://mariadb.com/kb/en/library/data-at-rest-encryption-overview/)

The main advantages of this approach are that your application code does not need significant changes to implement it, and that native solutions are generally more secure (because they are self-contained and don’t require manual implementation or coding). 

The main disadvantage is the (often substantial) cost of the Enterprise versions of these engines, as well as the time to migrate any existing data into the new structure and to learn to work with the new technology.

## Implementing native database encryption (TDE) with Cloud 66

If you need this level of encryption, you have two options:

1. A managed, TDE-enabled database instance from a cloud provider 
2. A manual installation of a database that supports TDE

The first option will generally end up costing more in hosting fees, but will save a lot of time on setup and maintenance. 

Many cloud providers offer TDE-enabled managed databases (or data storage solutions):

- [Amazon RDS](https://aws.amazon.com/rds/)
- [Azure](https://docs.microsoft.com/en-us/azure/storage/common/storage-service-encryption)

Once you have set up your external managed database, you will need to manually configure your application to connect to it securely.