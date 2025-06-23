import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
} from 'typeorm';

/**
 * Each node can have a parent and multiple children which forms a tree structure
 * If a node doesnt have a parent it is the root node
 * @export
 * @class Node
 */

@Entity()
export class Node {
  /**
   * Unique identifier for the node and generated as a UUID
   * @type {string}
   * @memberof Node
   */

  @PrimaryGeneratedColumn('uuid')
  id: string;

  /**
   * Name of the node
   * @type {string}
   * @memberof Node
   */
  @Column()
  name: string;

  /**
   * Value is stored as JSON in PostgreSQL. All keys are strings and values are numbers
   * @type {(Record<string, number> | {})}
   * @memberof Node
   */
  @Column({ type: 'jsonb', nullable: true })
  value: Record<string, number> | {};

  /**
   * The parent node in the tree. Null if this is a root node
   * @type {(Node | null)}
   * @memberof Node
   */

  @ManyToOne(() => Node, (node) => node.children, { nullable: true })
  parent: Node | null;

  /**
   * List of child nodes that belong to the node or the parent.
   * @type {Node[]}
   * @memberof Node
   */

  @OneToMany(() => Node, (node) => node.parent)
  children: Node[];

  /**
   * Path for the node to traverse
   * @type {string}
   * @memberof Node
   */

  @Column()
  path: string;
}
