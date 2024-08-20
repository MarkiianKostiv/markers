import {
  collection,
  onSnapshot,
  addDoc,
  doc,
  getDocs,
  writeBatch,
  updateDoc,
  DocumentSnapshot,
  DocumentData,
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
      const markersCollection = collection(db, "markers");

      const snapshot = await getDocs(markersCollection);
      let lastMarkerDoc = null;

      snapshot.forEach((docSnapshot) => {
        const data = docSnapshot.data() as IMarker;
        if (!data.next) {
          lastMarkerDoc = docSnapshot;
        }
      });

      const batch = writeBatch(db);

      const newMarkerRef = await addDoc(markersCollection, marker);

      if (lastMarkerDoc) {
        batch.update((lastMarkerDoc as DocumentSnapshot<DocumentData>).ref, {
          next: newMarkerRef.id,
        });
      }

      await batch.commit();
    } catch (error) {
      console.error("Error adding marker: ", error);
    }
  }

  async deleteMarker(markerId: string) {
    try {
      const markersCollection = collection(db, "markers");

      const snapshot = await getDocs(markersCollection);
      let previousMarkerDoc: DocumentSnapshot<DocumentData> | null = null;
      let nextMarkerId: string | null = null;

      snapshot.forEach((docSnapshot) => {
        const data = docSnapshot.data() as IMarker;
        if (data.next === markerId) {
          previousMarkerDoc = docSnapshot;
        }
        if (docSnapshot.id === markerId) {
          nextMarkerId = data.next;
        }
      });

      const batch = writeBatch(db);

      batch.delete(doc(db, "markers", markerId));

      if (previousMarkerDoc) {
        batch.update(
          (previousMarkerDoc as DocumentSnapshot<DocumentData>).ref,
          { next: nextMarkerId }
        );
      }

      await batch.commit();
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
