import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { Account, SourceInfo } from '../models/account/account.model';
import { AccountFeature } from '../models/account/account-features.model';

@Injectable({
  providedIn: 'root',
})
export class DataService {
  private apiUrl = 'http://localhost:3000';

  constructor(private http: HttpClient) {}

  getData(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/data`);
  }

  isUniqueUnitNumber(number: string): Observable<boolean> {
    return this.http
      .get<any[]>(`${this.apiUrl}/account?riaCustomerNumber=${number}`)
      .pipe(map((accounts) => accounts.length === 0));
  }

  getAccount(id: string): Observable<Account> {
    return this.http.get<Account>(`${this.apiUrl}/account/${id}`);
  }

  createAccount(account: Partial<Account>): Observable<Account> {
    account.id = Math.floor(Math.random() * 1000).toString();
    console.log(account.id);
    return this.http.post<Account>(`${this.apiUrl}/account`, account);
  }

  updateAccount(id: string, account: Partial<Account>): Observable<Account> {
    return this.http.put<Account>(`${this.apiUrl}/account/${id}`, account);
  }

  getSourceInfo(): Observable<SourceInfo[]> {
    return this.http.get<SourceInfo[]>(`${this.apiUrl}/sourceInfo`);
  }

  getAccountFeature(): Observable<{ row: AccountFeature[] }[]> {
    return this.http.get<{ row: AccountFeature[] }[]>(
      `${this.apiUrl}/accountFeature`,
    );
  }
}
