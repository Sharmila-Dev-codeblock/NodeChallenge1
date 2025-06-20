import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
} from 'typeorm';

@Entity()
export class Node {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ type: 'jsonb', nullable: true })
  value: Record<string, number> | {};

  @ManyToOne(() => Node, (node) => node.children, { nullable: true })
  parent: Node | null;

  @OneToMany(() => Node, (node) => node.parent)
  children: Node[];

  @Column()
  path: string;
}
