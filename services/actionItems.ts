import { NextResponse } from "next/server";
import pool from "./db";
import { getAuthToken } from "./utils";




export async function getActionItems() {

    const connection = await pool.getConnection();

    const auth_token = await getAuthToken();

    if (!auth_token) {
        return { items: [], accessDenied: true };
    }

    try {

        const response = await fetch('https://dev.exp-inc.com/EXPDev71/api/actionItems/searchActionItems', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'offset': "",
                'Auth_Token': auth_token?.toString()
            },
            body: JSON.stringify({
                source: [],
                status: "Pending,Overdue,PendingVerification",
                verifiedBy: 0,
                reportedFlag: 0,
                pageNumber: 1,
                pageSize: 20,
                dLocationID: "",
                sortOrder: 2,
                actionNum: "",
                verifiedDateChecked: 0,
                actionItem: "",
                createdBy: 0,
                sortBy: 3,
                assignedToId: 0,
                summaryBy: 0,
                groupBy: 0,
                checkDateBy: 0,
                startVerifiedDate: "",
                endVerifiedDate: "",
                IsAdvancedSearch: false,
                lupID: 1,
                globalRatingId: 0,
                workRelated: 0,
                obsMethod: 0,
                obsClassId: 0,
                obsResultCategoryId: 0,
                obsResultSubCategoryId: 0,
            }),
        });

        const result = await response.json();
        // return NextResponse.json({ statusCode: result.statusCode, message: result.message, data: result.data });
        return { items: result.data, accessDenied: false };
    } catch (error) {
        return { items: [], accessDenied: false };
    } finally {
        connection.release();
    }
}