import {
  collection,
  onSnapshot,
  addDoc,
  deleteDoc,
  doc,
  getDocs,
  writeBatch,
  updateDoc,
} from "firebase/firestore";
import db from "../db_config/firebaseConfig";
import { IMarker } from "../interfaces/IMarker";

export class MarkerService {
  getAllMarkers(callback: (markers: { id: string; data: IMarker }[]) => void) {
    onSnapshot(collection(db, "markers"), (snapshot) => {
      const markers = snapshot.docs.map((doc) => ({
        id: doc.id,
        data: doc.data() as IMarker,
      }));
      callback(markers);
    });
  }

  async createMarker(marker: IMarker) {
    try {
      await addDoc(collection(db, "markers"), marker);
    } catch (error) {
      console.error("Error adding marker: ", error);
    }
  }

  async deleteMarker(markerId: string) {
    try {
      await deleteDoc(doc(db, "markers", markerId));
    } catch (error) {
      console.error("Error deleting marker: ", error);
    }
  }

  async deleteAllMarkers() {
    try {
      const markersCollection = collection(db, "markers");
      const snapshot = await getDocs(markersCollection);
      const batch = writeBatch(db);
      snapshot.forEach((docSnapshot) => {
        batch.delete(docSnapshot.ref);
      });
      await batch.commit();
    } catch (error) {
      console.error("Error deleting markers: ", error);
    }
  }

  async updateMarkerLocation(
    markerId: string,
    newLocation: { _lat: number; _long: number }
  ) {
    try {
      const markerRef = doc(db, "markers", markerId);
      await updateDoc(markerRef, {
        "location._lat": newLocation._lat,
        "location._long": newLocation._long,
      });
    } catch (error) {
      console.error("Error updating marker location: ", error);
    }
  }
}
