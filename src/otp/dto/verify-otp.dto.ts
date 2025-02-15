import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsNumber,
  IsString,
  Matches,
} from 'class-validator';
import { emailRegex } from 'src/utils/validation';

export class SendOtpDto {
  @ApiProperty({ required: true })
  @IsNotEmpty({ message: 'Email is required' })
  @IsString({ message: 'Email must be string' })
  @IsEmail({}, { message: 'Invalid email address' })
  @Matches(emailRegex, {
    message: 'Please enter a valid email address',
  })
  email: string;

  @ApiProperty({ required: true })
  @IsNotEmpty({ message: 'Full name is required' })
  @IsString({ message: 'Full name must be string' })
  fullName: string;
}

export class VerifyOtpDto {
  @ApiProperty({ required: true })
  @IsNumber()
  @IsNotEmpty({ message: 'Otp code is required' })
  otpCode: number;

  @ApiProperty({ required: true })
  @IsNotEmpty({ message: 'Email is required' })
  @IsString({ message: 'Email must be string' })
  @IsEmail({}, { message: 'Invalid email address' })
  @Matches(emailRegex, {
    message: 'Please enter a valid email address',
  })
  email: string;
}

export class ResendOtpDto {
  @ApiProperty({ required: true })
  @IsNotEmpty({ message: 'Email is required' })
  @IsString({ message: 'Email must be string' })
  @IsEmail({}, { message: 'Invalid email address' })
  @Matches(emailRegex, {
    message: 'Please enter a valid email address',
  })
  email: string;

  @ApiProperty({ required: true })
  @IsNotEmpty({ message: 'Full name is required' })
  @IsString({ message: 'Full name must be string' })
  fullName: string;
}
