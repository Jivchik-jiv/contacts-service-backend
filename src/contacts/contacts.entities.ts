import { UpdateContactDto } from './dto/update-contact.dto';

export interface UpdateContactInterface extends UpdateContactDto {
  isFriend: boolean;
  avatar: string;
  cloudAvatarId: string;
}
