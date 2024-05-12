import mysql from "../db/connection.js";
import { Users } from "../db/static-db.js";
import { v4 as uuid } from "uuid";
import { User } from "../utils/types.js";


export async function getAllUsers() {
    return await mysql("users").select("*");
}

export async function isAuthenticated(email: string, password: string) {
    try {
        let user: User = Users.map( userVal => {
            if(userVal.email === email && userVal.password === password) {
                return userVal;
            }
        })[0]
        let userId = user.id;
        if (userId) {
            return true;
        }
    } catch (error) {
        console.log("Error occurred while authenticating user:", error);
    }
    return false;
}

export async function getUserByCredentials(email: string, password: string) {
    try {
        let user: User = Users.map( userVal => {
            if(userVal.email === email && userVal.password === password) {
                return userVal;
            }
        })[0]
        if(!user) {
            console.log("User not found!")
        }
        return user;
    } catch (error) {
        console.log("Error occurred while finding user by credentials:", error);
    }
}

export async function addNewUser(name: string, email: string, password: string) {
    try {
        const id = uuid();
        Users.push({
            id: id,
            email: email,
            password: password,
            name: name
        });
        const user = getUserByID(id);
        return user;
    } catch (error) {
        console.log("Error occurred while adding user:", error);
    }

}

export async function getUserByID(id: string) {
    try {
        return Users.map(user => {
            if(user.id === id) {
                return user;
            }
        })[0]
    } catch (error) {
        console.log("Error occurred while getting user:", error);
    }
  }