import { sql } from './sql';
import { Vacation } from './models/vacations';


export async function addVacation(Description: string, Destination: string, Picture: string, StarDate: string, EndDate: string, Price: string, NumOfFollowers = '0'): Promise<number> {
    const [{ insertId }] = await sql.execute('INSERT INTO vacations (Description, Destination, Picture, StarDate, EndDate, Price, NumOfFollowers) VALUES (?, ?, ?, ?, ?, ?, ?)', [Description, Destination, Picture, StarDate, EndDate, Price, NumOfFollowers]);
    return insertId;
}

export async function getAllVacations(ID: number): Promise<Vacation[]> {
    const [favVacations] = await sql.execute(`SELECT vacations.ID, Description, Destination, Picture, StarDate, EndDate, Price, NumOfFollowers,
    IF(UserId > 0, true, false) AS follow FROM vacations LEFT JOIN uservacations ON vacations.ID = vacationId WHERE UserId = ?`, [ID]);

    if (!favVacations.length) {

        const [vacations] = await sql.execute('SELECT *, IF(1 = 0, true, false) AS follow FROM vacations');
        return vacations
    }
    const ids = favVacations.map(() => '?')
    const [vacations] = await sql.execute(`SELECT *, IF(1 = 0, true, false) AS follow FROM vacations WHERE ID NOT IN(${ids})`, favVacations.map((favVacation: any) => favVacation.ID));
    console.log({ vacations })
    return vacations.concat(favVacations)

}

export async function deleteVacation(vacationId: number): Promise<boolean> {
    const [{ affectedRows }] = await sql.execute('DELETE FROM vacations WHERE id = ?', [vacationId])
    return affectedRows > 0
}

export async function followVacation(UserId: number, VacationId: number): Promise<Vacation> {
    const [result] = await sql.execute('INSERT INTO userVacations (UserId, VacationId) VALUES (?, ?)', [UserId, VacationId])
    return result
}

export async function unfollowVacation(UserId: number, VacationId: number): Promise<any> {
    const [result] = await sql.execute('DELETE FROM userVacations WHERE UserId = ? AND VacationId = ?', [UserId, VacationId]);
    return result.affectedRows > 0;
}


export async function isUserFollowingVacation(UserId: number, VacationId: number): Promise<boolean> {
    const [vacations] = await sql.execute('SELECT 1 FROM userVacations WHERE UserId = ? AND VacationId = ?', [UserId, VacationId]);
    return vacations.length > 0;
}

export async function increaseFollowersAmount(VacationId: number): Promise<boolean> {
    const [{ affectedRows }] = await sql.execute('UPDATE vacations SET NumOfFollowers = NumOfFollowers + 1 WHERE ID = ?', [VacationId])
    console.log({ affectedRows })
    return affectedRows > 0;
}

export async function decreaseFollowersAmount(VacationId: number): Promise<boolean> {
    const [{ affectedRows }] = await sql.execute('UPDATE vacations SET NumOfFollowers = NumOfFollowers - 1 WHERE ID = ?', [VacationId])
    return affectedRows > 0;
}

export async function updateVacation(vacationId: number, updateObj: any): Promise<number> {
    const updateStr = Object.keys(updateObj).map(key => `${key} = ?`).join(','); // "returnAt = ?, description = ?"
    const [res] = await sql.execute<any>(`UPDATE vacations SET ${updateStr} WHERE ID = ?`, [...Object.values(updateObj), vacationId]);
    return res.affectedRows;
}