/*
****
***
**
*
*/
#include<iostream>
using namespace std;

int main()
{
    int n;
    cout<<"Enter number:";
    cin>>n;

    int i=1;
    while(i<=n){
        int j=n-i+1;
        while(j>=1){
            cout<<"*";
            j-=1;
        }
        cout<<endl;
        i+=1;
    }
    return 0;
}