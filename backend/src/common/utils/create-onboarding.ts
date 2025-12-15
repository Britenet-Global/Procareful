import { Admin, Onboarding } from '../../admin/entities';
import { User } from '../../user/entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { ESeniorFormType } from '../../admin/caregiver/types';

@Injectable()
export class OnboardingService {
  constructor(
    @InjectRepository(Onboarding)
    private readonly onboardingRepository: Repository<Onboarding>,
  ) {}
  async createOnboardingObject(
    model: Admin | User,
    maxSteps: number,
    formType?: ESeniorFormType,
    first?: boolean,
  ): Promise<void> {
    const steps: Record<string, boolean> = {};

    for (let i = 1; i <= maxSteps; i++) {
      steps[`step${i}`] = false;
    }

    const onboarding = new Onboarding();

    if (model instanceof Admin) {
      onboarding.admin = model;
    } else if (model instanceof User) {
      if (!onboarding.user) {
        onboarding.user = [];
      }
      onboarding.user.push(model);
    }

    Object.assign(onboarding, { ...steps, form_type: formType });
    first && (onboarding.step1 = true);

    await this.onboardingRepository.save(onboarding);
  }
}
