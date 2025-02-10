export type UserDto = {
    id: number;
    name: string;
    userName: string | null;
    password: string | null;
    email: string;
    phone: string;
    is_admin: boolean;
    is_shop: boolean;
    is_editor: boolean;
    is_registrant: boolean;
    picture: string | null;
    gender: string | null;
    email_verified: boolean;
    status: string;
    createdAt: Date;
    updatedAt: Date;
};
