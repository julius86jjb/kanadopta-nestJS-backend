import { BadRequestException, InternalServerErrorException, Logger } from "@nestjs/common";

export class HandleExceptionsService {

  private readonly logger = new Logger('HandleExceptionsService');


  public handleDBExceptions(error: any) {
    this.logger.error(error);
    console.log(error);
    if ((error.code === '23505')) throw new BadRequestException(error);
    



    throw new InternalServerErrorException('Unexpected error, check logs');
  }
}