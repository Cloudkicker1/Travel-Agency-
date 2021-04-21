import { sql } from './sql';
import { User } from './models/user';
import { compare, hash } from 'bcrypt';

export async function checkUserExists(userName: string): Promise<boolean> {
    const [users] = await sql.execute('SELECT ID FROM users WHERE userName = ?', [userName]);
    return users.length > 0;
}


export async function register(firstName: string, lastName: string, userName: string, password: string, isAdmin: boolean): Promise<number | null> {
    const [users] = await sql.execute('SELECT ID FROM users WHERE userName = ?', [userName]);
    if (users.length > 0) {
        return null;
    }

    const hashedPassword = await hash(password, 10);
    const [{ insertId: userId }] = await sql.execute('INSERT INTO users (firstName, lastName, userName, password, isAdmin) VALUES (?, ?, ?, ?, ?)', [firstName, lastName, userName, hashedPassword, isAdmin]);
    return userId;
}

export async function login(userName: string, password: string): Promise<number | null> {
    const [users] = await sql.execute('SELECT ID, password FROM users WHERE userName = ?', [userName]);
    if (users.length === 0) {
        return null;
    }

    const { ID, password: hashedPasswordInDb } = users[0];
    const isPasswordCorrect = await compare(password, hashedPasswordInDb);
    if (!isPasswordCorrect) {
        return null;
    }
    return ID;
}


export async function authenticateUser(UserId: number) {
    const [[returningUser]] = await sql.execute('SELECT isAdmin from users WHERE ID = ?', [UserId]);
    return returningUser;
}


