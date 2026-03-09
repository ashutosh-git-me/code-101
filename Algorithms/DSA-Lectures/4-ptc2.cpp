/*
A 
B C 
D E F 
G H I J 
K L M N O 
P Q R S T U */

#include<iostream>
using namespace std;

int main()
{
    int n;
    cout<<"Enter number:";
    cin>>n;

    char ch='A';

    int i=1;

    while(i<=n){
        int j=1;
        while(j<=i){
            cout<<ch<<" ";
            ch+=1;
            j+=1;
        }
        cout<<endl;
        i+=1;
    }
    return 0;
}