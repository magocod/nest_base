import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User, Role, Permission } from '../auth/entities';
import { DataSource, Repository } from 'typeorm';
import { RoleNames, PermissionNames, DefaultEmails } from '../auth/interfaces';
import { Topic } from '../notifications/entities';

@Injectable()
export class SeedService {
  // not working without nest app
  private readonly logger = new Logger('SeedService');

  // working without nest app
  // private readonly userRepository: Repository<User>;
  // private readonly roleRepository: Repository<Role>;
  // private readonly permissionRepository: Repository<Permission>;
  // private readonly topicRepository: Repository<Topic>;

  constructor(
    // error inject repository in commands
    // @InjectRepository(User)
    // private readonly userRepository: Repository<User>,
    private readonly dataSource: DataSource,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Role)
    private readonly roleRepository: Repository<Role>,
    @InjectRepository(Permission)
    private readonly permissionRepository: Repository<Permission>,
    @InjectRepository(Topic)
    private readonly topicRepository: Repository<Topic>,
  ) {
    // working without nest app
    // this.userRepository = dataSource.getRepository(User);
    // this.roleRepository = dataSource.getRepository(Role);
    // this.permissionRepository = dataSource.getRepository(Permission);
    // this.topicRepository = dataSource.getRepository(Topic);
  }

  // for testing
  /**
   * @deprecated
   */
  getDataSource(): DataSource {
    return this.dataSource;
  }

  /**
   * note: it is not safe to run seed repeatedly
   */
  async seed() {
    this.logger.log('start');
    // TODO seed - improve saving, repeated code

    // auth
    this.logger.log('auth seed');

    let permissions: Permission[] = [];

    for (const name of Object.values(PermissionNames)) {
      permissions.push(
        this.permissionRepository.create({
          name,
          description: '...',
        }),
      );
    }

    permissions = await this.permissionRepository.save(permissions);

    // require unique constraint
    // const result = await this.permissionRepository.upsert(
    //   permissions,
    //   ['name'],
    // );

    const superUser = await this.roleRepository.save({
      name: RoleNames.SUPER_USER,
      description: '...',
      permissions,
    });

    const admin = await this.roleRepository.save({
      name: RoleNames.ADMIN,
      description: '...',
      permissions: permissions.filter((p) => {
        return [PermissionNames.USER].includes(p.name as PermissionNames);
      }),
    });

    const user = await this.roleRepository.save({
      name: RoleNames.USER,
      description: '...',
      permissions: permissions.filter((p) => {
        return [PermissionNames.EXAMPLE].includes(p.name as PermissionNames);
      }),
    });

    await this.userRepository.save(
      await this.userRepository.create({
        email: DefaultEmails.SUPER_USER,
        password: '123*Abc',
        fullName: 'superuser',
        roles: [superUser],
      }),
      // ['email'],
    );

    await this.userRepository.save(
      await this.userRepository.create({
        email: DefaultEmails.ADMIN,
        password: '123*Abc',
        fullName: 'admin',
        roles: [admin],
      }),
      // ['email'],
    );

    await this.userRepository.save(
      await this.userRepository.create({
        email: DefaultEmails.USER,
        password: '123*Abc',
        fullName: 'superuser',
        roles: [user],
      }),
      // ['email'],
    );

    // console.log(
    //   JSON.stringify(
    //     await this.userRepository.find({
    //       relations: {
    //         roles: {
    //           permissions: true,
    //         },
    //       },
    //     }),
    //     null,
    //     2,
    //   ),
    // );

    this.logger.log('other seed');

    await this.topicRepository.save([
      {
        name: 'a',
      },
      {
        name: 'b',
      },
      {
        name: 'c',
      },
    ]);

    this.logger.log('completed');

    return {
      users: await this.userRepository.count(),
      roles: await this.roleRepository.count(),
      permissions: await this.permissionRepository.count(),
    };
  }
}
