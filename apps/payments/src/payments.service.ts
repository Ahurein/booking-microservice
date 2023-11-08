import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import stripe, { Stripe } from 'stripe'
import { CreateChargeDto } from '../../../libs/common/src/dto/create-charge.dto';
import { NOTIFICATIONS_SERVICE } from '@app/common';
import { ClientProxy } from '@nestjs/microservices';
import { PaymentsCreateChargeDto } from './dto/payments-create-charge-dto';

@Injectable()
export class PaymentsService {
  private readonly stripe = new Stripe(this.configService.get("STRIPE_SECRET_KEY"), { apiVersion: "2023-10-16" })

  constructor(private readonly configService: ConfigService, @Inject(NOTIFICATIONS_SERVICE) private readonly notificationService: ClientProxy) { }

  async createCharge({ email, amount }: PaymentsCreateChargeDto) {
    // const paymentMethod = await this.stripe.paymentMethods.create({ type: "card", card })
    const paymentIntent = await this.stripe.paymentIntents.create({
      // payment_method: paymentMethod.id,
      payment_method: "pm_card_visa",
      amount: amount * 100,
      confirm: true,
      payment_method_types: ['card'],
      currency: "usd"
    });

    this.notificationService.emit("notify_email", {email} )

    return paymentIntent;
  }
}
