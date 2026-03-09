#include<iostream>
using namespace std;

int main()
{
    int n;
    cout<<"Enter number:";
    cin>>n;
    int i=1;
    char ch='A';

    while(i<=n){
        int j=1;
        while(j<=i){
            cout<<ch<<" ";
            j+=1;
        }
        cout<<endl;
        i+=1;
        ch+=1;
    }
    return 0;
}