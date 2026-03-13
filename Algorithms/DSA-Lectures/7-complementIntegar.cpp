/*
Complement of Integar
*/
#include<iostream>
using namespace std;

int main()
{
    int n;
    cout<<"Enter Integar:";
    cin>>n;

    int m = n;
    int mask=0;

    if(n==0){
        return 1;
    }
        
    while(m!=0){
        mask= (mask<<1) | 1;//to add 1 @ end
        m= m>>1;
    }
    int ans= (~n) & mask;
    cout<<ans;
}