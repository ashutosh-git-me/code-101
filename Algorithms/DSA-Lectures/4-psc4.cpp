/*
A B C 
B C D 
C D E 
D E F */
#include<iostream>
using namespace std;

int main()
{
    int n;
    cout<<"Enter number;";
    cin>>n;

    int i=1;
    while(i<=n){
        int j=1;
        
        while(j<n){
            char ch='A'+i+j-2;
            cout<<ch<<" ";
            j+=1;
        }
        cout<<endl;
        i+=1;
    }
}