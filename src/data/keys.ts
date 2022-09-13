import type {Ref, InjectionKey} from 'vue';
import type {UserProfile, Client} from '../types/models';

export const UserProfileInjectionKey = Symbol() as InjectionKey<Ref<UserProfile>>;
export const CurrentClientInjectionKey = Symbol() as InjectionKey<Ref<Client>>;
