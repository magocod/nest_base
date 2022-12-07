import { Injectable } from '@nestjs/common';
import { CreateDashboardInput } from './dto/create-dashboard.input';
import { UpdateDashboardInput } from './dto/update-dashboard.input';

@Injectable()
export class DashboardService {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  create(createDashboardInput: CreateDashboardInput) {
    return 'This action adds a new dashboard';
  }

  findAll() {
    return `This action returns all dashboard`;
  }

  findOne(id: number) {
    return `This action returns a #${id} dashboard`;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  update(id: number, updateDashboardInput: UpdateDashboardInput) {
    return `This action updates a #${id} dashboard`;
  }

  remove(id: number) {
    return `This action removes a #${id} dashboard`;
  }
}
