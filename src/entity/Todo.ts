import { Field, ID, ObjectType } from 'type-graphql';
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  Index,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from './User';

@Entity({ name: 'Todos' })
@ObjectType()
export class Todo extends BaseEntity {
  @Field(() => ID)
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Field(() => ID)
  @Column({
    nullable: false,
  })
  userId!: string;

  @Index()
  @ManyToOne(() => User, (user) => user.todos)
  user!: User;

  @Field(() => String)
  @Column({
    type: 'varchar',
    nullable: false,
  })
  title!: string;

  @Field(() => String)
  @Column({
    type: 'varchar',
    nullable: true,
  })
  description!: string;

  @UpdateDateColumn({
    type: 'timestamp with time zone',
    nullable: true,
    default: null,
  })
  updatedAt!: Date;

  @Field(() => Date)
  @CreateDateColumn({
    type: 'timestamp with time zone',
  })
  createdAt!: Date;

  @Field(() => Date, {
    nullable: true,
  })
  @DeleteDateColumn({
    type: 'timestamp with time zone',
    nullable: true,
    default: null,
  })
  deletedAt!: Date;

  @Field(() => Date, {
    nullable: true,
  })
  @Column({
    type: 'timestamp with time zone',
    nullable: true,
    default: null,
  })
  completedAt!: Date;
}
