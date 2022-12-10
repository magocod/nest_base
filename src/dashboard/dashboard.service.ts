import { Injectable } from '@nestjs/common';
import { Dashboard } from './types';
import { tabDashboard, tabItems, tabSetting } from './dashboard.constants';

@Injectable()
export class DashboardService {
  sample(): Dashboard {
    return {
      url: '/base',
      children: [tabDashboard, tabItems, tabSetting],
    };
  }
}
