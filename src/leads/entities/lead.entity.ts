import {
  Index,
  Entity,
  Column,
  CreateDateColumn,
  PrimaryGeneratedColumn,
} from 'typeorm'

@Entity('leads')
@Index(['email'], { unique: true })
export class Lead {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column()
  firstName: string

  @Column()
  lastName: string

  @Column({ unique: true })
  email: string

  @Column({ nullable: true })
  phone?: string

  @Column({ default: 'manual' })
  source: 'manual' | 'external'

  @Column({ nullable: true, type: 'text' })
  summary?: string

  @Column({ nullable: true })
  nextAction?: string

  @CreateDateColumn()
  createdAt: Date
}

