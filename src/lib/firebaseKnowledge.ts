import { 
  collection, 
  doc, 
  getDocs, 
  addDoc, 
  updateDoc, 
  query, 
  where, 
  orderBy,
  onSnapshot
} from 'firebase/firestore';
import { db, auth } from './firebase';
import { handleFirestoreError, OperationType } from './firebaseRepair';

export interface KnowledgeArticle {
  id?: string;
  title: string;
  content: string;
  category: 'hardware' | 'software' | 'network' | 'frp';
  deviceId?: string;
  authorId: string;
  createdAt: string;
  tags: string[];
}

const ARTICLES_COLLECTION = 'knowledge_base';

export const knowledgeService = {
  subscribeToArticles(callback: (articles: KnowledgeArticle[]) => void) {
    const q = query(collection(db, ARTICLES_COLLECTION), orderBy('createdAt', 'desc'));
    return onSnapshot(q, (snapshot) => {
      const articles = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as KnowledgeArticle));
      callback(articles);
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, ARTICLES_COLLECTION);
    });
  },

  async addArticle(article: Omit<KnowledgeArticle, 'id' | 'authorId' | 'createdAt'>): Promise<string> {
    try {
      const docRef = await addDoc(collection(db, ARTICLES_COLLECTION), {
        ...article,
        authorId: auth.currentUser?.uid || 'anonymous',
        createdAt: new Date().toISOString(),
      });
      return docRef.id;
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, ARTICLES_COLLECTION);
      return '';
    }
  }
};
