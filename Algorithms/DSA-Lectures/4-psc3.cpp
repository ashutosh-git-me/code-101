/*
A B C  
D E F
G H I */
#include<iostream>
using namespace std;

int main()
{
    int n;
    cout<<"Enter number;";
    cin>>n;
    char ch='A';
    int i=1;
    while(i<=n){
        int j=1;
        
        while(j<n){
            cout<<ch<<" ";
            j+=1;
            ch+=1;
        }
        cout<<endl;
        i+=1;
    }
}