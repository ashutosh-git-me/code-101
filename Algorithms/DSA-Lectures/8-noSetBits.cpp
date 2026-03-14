//Number of Set Bits in a & b
#include<iostream>
using namespace std;

int setBits(int n){
    int count =0;
    while(n!=0){
        if(n&1){
            count++;
        }
        n=n>>1;
    }
    return count;
}

int main()
{
    int a,b;
    cout<<"Enter numbers:";
    cin>>a>>b;
    int ans=setBits(a)+setBits(b);
    cout<<"No. of Set-Bits are: "<<ans;
    return 0;
}