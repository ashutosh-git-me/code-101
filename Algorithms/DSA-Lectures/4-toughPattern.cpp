#include<iostream>
using namespace std;

int main()
{
    int n;
    cout<<"Enter number:";
    cin>>n;

    int i=1;

    while (i<=n)
    {
        int space =n-i;
        while(space){
            cout<<" ";
            space-=1;
        }
        int j=1;
        while(j<=i){
            cout<<j;
            j+=1;
        }
        int k=i-1;
        while(k){
            cout<<k;
            k-=1;
        }

        cout<<endl;
        i+=1;

    }
    
}