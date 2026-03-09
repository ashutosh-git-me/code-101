/*
*
**
***
****
******/
#include<iostream>
using namespace std;

int main(){
    int n;
    cout<<"Enter Number: ";
    cin>>n;

    int i=1;
    while (i<=n)
    {
       for (int j = 1; j <= i; j++)//while(j<=i)
       {
        cout<<"*";
       }
       cout<<endl;
       i+=1;
    }
    
}