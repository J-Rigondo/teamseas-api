import { Injectable } from '@nestjs/common';
import { CreateDonationInput } from './dto/create-donation.input';
import { UpdateDonationInput } from './dto/update-donation.input';
import { PrismaService } from 'prisma/prisma.service';

@Injectable()
export class DonationsService {
  constructor(private prisma: PrismaService) {}
  create(createDonationInput: CreateDonationInput) {
    return 'This action adds a new donation';
  }

  findAll() {
    return this.prisma.donation.findMany();
  }

  findOne(id: number) {
    return this.prisma.donation.findUnique({
      where: {
        id,
      },
    });
  }

  update(id: number, updateDonationInput: UpdateDonationInput) {
    return `This action updates a #${id} donation`;
  }

  remove(id: number) {
    return `This action removes a #${id} donation`;
  }
}
