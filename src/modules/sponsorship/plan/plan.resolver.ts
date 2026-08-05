import { Resolver } from '@nestjs/graphql';
import { PlanService } from './plan.service';

@Resolver('Plan')
export class PlanResolver {
  constructor(private readonly planService: PlanService) {}
}
