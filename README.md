# Tree Structure

This backend service allows you to create nested nodes, fetch subtrees and add or update properties of the node.

## Tech stack

| Tool       | Description                  |
| ---------- | ---------------------------- |
| NestJS     | Node.js framework            |
| TypeORM    | ORM for database interaction |
| PostgreSQL | Relational database          |
| Jest       | Testing framework            |
| TypeScript | Type-safe JavaScript         |


## Features

- Create nodes with or without a parentid
- Retrieve full subtrees from any node
- Add or update key-value properties to nodes
- Test case using jest

---

## How to Download and Run

Step 1 : Clone the Repository

git clone https://github.com/your-username/codeblock_challenge1.git


Step 2 : Install Dependencies

npm install

Step 3 : Configure Database

Update the database settings in src/app.module.ts :

TypeOrmModule.forRoot({
  type: 'postgres',
  host: 'localhost',
  port: 5432,
  username: 'your_username',
  password: 'your_password',
  database: 'your_db_name',
  entities: [Node],
  synchronize: true,
});

Step 4 : To run the application

npm run start:dev

(The server will run on http://localhost:3000)


Step 4 : To run the test case

npm test

---

## Postman Collection

To test api endpoints in postman follow the link

https://sharmilal-6769450.postman.co/workspace/Sharmila-L's-Workspace~7124b7ba-5c44-4673-8da4-7329718f837e/collection/46032559-71dc34a4-2bba-4090-9cc9-953a511443ed?action=share&creator=46032559


## Endpoints

| Method | Endpoint                   | Description                      |
| ------ | -------------------------- | -------------------------------- |
| POST   | `/nodes`                   | Create a node                    |
| GET    | `/nodes/gettree/:parentId` | Get subtree from specific node   |
| GET    | `/nodes/gettree`           | Get all root nodes with subtrees |
| PATCH  | `/nodes/:nodeId/property`  | Add or update a node property    |


## Node Service Explanation

1) createNode(dto: CreateNodeDto): Promise<Node>

- Creates a new node if parentId is not provided.
- If parentId is provided the node is added under the parent with the respective parentId.
- If value is provided it will added if not value is assigned as null
- Saves the node to the database.

2) getSubtreeByParentId(parentId?: string): Promise<Node | Node[]>
- Fetches a node and its entire subtree.
- If parentId is given it returns that node and its subtree.
- If parentId is not given it returns all root nodes and their subtrees.

3) addProperty(nodeId: string, key: string, value: number): Promise<Node>
- Adds or updates a key-value pair in a node value object.
- Creates the value if it doesn’t exist.
- Updates the new key if it does.

4) private loadSubTreeChildren(node: Node): Promise<void>
- Fetches children for the given node.
- This method is used in getSubtreeByParentId to recursively populate children of children.
