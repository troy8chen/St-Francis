'use client';

import {
    addDoc,
    collection,
    doc,
    getDoc,
    Timestamp,
    updateDoc,
} from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { firestore } from '../../../firebase/firebase';
import { Client } from '../../../components/ClientList/ClientList';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import styles from './checkin.module.css';

interface CheckinProps {
    params: { userId: string };
}

export interface Visit {
    clothingMen: boolean;
    clothingWomen: boolean;
    clothingBoy: boolean;
    clothingGirl: boolean;
    household: string;
    notes: string;
    timestamp: Timestamp;
    backpack: boolean;
    sleepingBag: boolean;
    busTicket: number;
    giftCard: number;
    diaper: number;
    financialAssistance: number;
}

export default function Checkin({ params }: CheckinProps) {
    const router = useRouter();
    const [oldClientData, setOldClientData] = useState<Client>();
    const [visitData, setVisitData] = useState<Visit>({
        clothingMen: false,
        clothingWomen: false,
        clothingBoy: false,
        clothingGirl: false,
        household: '',
        notes: '',
        timestamp: Timestamp.fromDate(new Date()),
        backpack: false,
        sleepingBag: false,
        busTicket: 0,
        giftCard: 0,
        diaper: 0,
        financialAssistance: 0,
    });

    // Get client data on component load
    useEffect(() => {
        getClientData();
    }, []);

    // Gets the client's data from firestore based on route's userId
    const getClientData = async () => {
        const clientDoc = await getDoc(
            doc(firestore, 'clients', params.userId)
        );

        // Set local state if their doc exists, otherwise go back to homepage
        if (clientDoc.exists()) {
            setOldClientData({
                id: params.userId,
                firstName: clientDoc.data().firstName,
                lastName: clientDoc.data().lastName,
                birthday: clientDoc.data().birthday,
                notes: clientDoc.data().notes,
                isCheckedIn: clientDoc.data().isCheckedIn,
                isBanned: clientDoc.data().isBanned,
            });
        } else {
            router.push('/');
        }
    };

    // Checkin process
    const checkIn = async () => {
        // Update isCheckedIn status to true
        await updateDoc(doc(firestore, 'clients', params.userId), {
            isCheckedIn: true,
        });

        // Update timestamp to current time
        setVisitData((prev: typeof visitData) => ({
            ...prev,
            timestamp: Timestamp.fromDate(new Date()),
        }));

        // Add new visit entry
        await addDoc(
            collection(firestore, 'clients', params.userId, 'visits'),
            visitData
        );

        // Get updated client data
        getClientData();

        // Redirect to user profile page after checking user in
        router.push(`/profile/${params.userId}`);
    };

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <h1>Check-in page</h1>

                <div className={styles.headerRow}>
                    <h2>{`${oldClientData?.firstName} ${oldClientData?.lastName}`}</h2>

                    <p>
                        {oldClientData?.isCheckedIn
                            ? 'Checked in'
                            : 'Not checked in'}
                    </p>

                    <Link href={`/update/${params.userId}`}>
                        <button>Edit profile</button>
                    </Link>
                </div>

                <p>Notes:</p>
                <p>{oldClientData ? oldClientData.notes : null}</p>
            </div>

            <form
                onSubmit={(e) => {
                    e.preventDefault(); // Prevent redirect
                    checkIn();
                }}
                className={styles.form}
            >
                <h2>Clothing</h2>

                <div className={styles.formRows}>
                    <div className={styles.formRowItem}>
                        <label htmlFor="clothingMen">Men</label>
                        <input
                            type="checkbox"
                            name="clothingMen"
                            id="clothingMen"
                            value={visitData.clothingMen ? 'on' : 'off'}
                            onChange={(e) => {
                                setVisitData((prev: any) => ({
                                    ...prev,
                                    clothingMen: e.target.checked,
                                }));
                            }}
                        />
                    </div>

                    <div className={styles.formRowItem}>
                        <label htmlFor="clothingWomen">Women</label>
                        <input
                            type="checkbox"
                            name="clothingWomen"
                            id="clothingWomen"
                            value={visitData.clothingWomen ? 'on' : 'off'}
                            onChange={(e) => {
                                setVisitData((prev: any) => ({
                                    ...prev,
                                    clothingWomen: e.target.checked,
                                }));
                            }}
                        />
                    </div>

                    <div className={styles.formRowItem}>
                        <label htmlFor="clothingBoy">Kids (Boy)</label>
                        <input
                            type="checkbox"
                            name="clothingBoy"
                            id="clothingBoy"
                            value={visitData.clothingBoy ? 'on' : 'off'}
                            onChange={(e) => {
                                setVisitData((prev: any) => ({
                                    ...prev,
                                    clothingBoy: e.target.checked,
                                }));
                            }}
                        />
                    </div>

                    <div className={styles.formRowItem}>
                        <label htmlFor="clothingGirl">Kids (Girl)</label>
                        <input
                            type="checkbox"
                            name="clothingGirl"
                            id="clothingGirl"
                            value={visitData.clothingGirl ? 'on' : 'off'}
                            onChange={(e) => {
                                setVisitData((prev: any) => ({
                                    ...prev,
                                    clothingGirl: e.target.checked,
                                }));
                            }}
                        />
                    </div>
                </div>

                <h2>Special Requests</h2>

                <div className={styles.formRows}>
                    <div className={styles.formRowItem}>
                        <label htmlFor="backpack">Backpack</label>
                        <input
                            type="checkbox"
                            name="backpack"
                            id="backpack"
                            value={visitData.backpack ? 'on' : 'off'}
                            onChange={(e) => {
                                setVisitData((prev: any) => ({
                                    ...prev,
                                    backpack: e.target.checked,
                                }));
                            }}
                        />
                    </div>

                    <div className={styles.formRowItem}>
                        <label htmlFor="sleepingBag">Sleeping Bag</label>
                        <input
                            type="checkbox"
                            name="sleepingBag"
                            id="sleepingBag"
                            value={visitData.sleepingBag ? 'on' : 'off'}
                            onChange={(e) => {
                                setVisitData((prev: any) => ({
                                    ...prev,
                                    sleepingBag: e.target.checked,
                                }));
                            }}
                        />
                    </div>

                    <div className={styles.formRowItem}>
                        <label htmlFor="busTicket">Bus Ticket</label>
                        <input
                            type="number"
                            name="busTicket"
                            id="busTicket"
                            value={visitData.busTicket}
                            onChange={(e) => {
                                setVisitData((prev: any) => ({
                                    ...prev,
                                    busTicket: e.target.value,
                                }));
                            }}
                        />
                    </div>

                    <div className={styles.formRowItem}>
                        <label htmlFor="giftCard">Gift Card</label>
                        <input
                            type="number"
                            name="giftCard"
                            id="giftCard"
                            value={visitData.giftCard}
                            onChange={(e) => {
                                setVisitData((prev: any) => ({
                                    ...prev,
                                    giftCard: e.target.value,
                                }));
                            }}
                        />
                    </div>

                    <div className={styles.formRowItem}>
                        <label htmlFor="diaper">Diaper</label>
                        <input
                            type="number"
                            name="diaper"
                            id="diaper"
                            value={visitData.diaper}
                            onChange={(e) => {
                                setVisitData((prev: any) => ({
                                    ...prev,
                                    diaper: e.target.value,
                                }));
                            }}
                        />
                    </div>

                    <div className={styles.formRowItem}>
                        <label htmlFor="financialAssistance">
                            Financial Assistance
                        </label>
                        <input
                            type="number"
                            name="financialAssistance"
                            id="financialAssistance"
                            value={visitData.financialAssistance}
                            onChange={(e) => {
                                setVisitData((prev: any) => ({
                                    ...prev,
                                    financialAssistance: e.target.value,
                                }));
                            }}
                        />
                    </div>
                </div>

                <label htmlFor="household">
                    <h2>Household items</h2>
                </label>
                <input
                    type="text"
                    name="household"
                    id="household"
                    value={visitData.household}
                    onChange={(e) => {
                        setVisitData((prev: typeof visitData) => ({
                            ...prev,
                            household: e.target.value,
                        }));
                    }}
                />

                <label htmlFor="notes">
                    <h2>Notes</h2>
                </label>
                <input
                    type="text"
                    name="notes"
                    id="notes"
                    value={visitData.notes}
                    onChange={(e) => {
                        setVisitData((prev: typeof visitData) => ({
                            ...prev,
                            notes: e.target.value,
                        }));
                    }}
                />

                <button type="submit">Check in</button>
            </form>
        </div>
    );
}
