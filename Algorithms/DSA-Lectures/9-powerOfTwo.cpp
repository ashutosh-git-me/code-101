//If number is power of two
#include<iostream>
using namespace std;

bool isPow(int n){
    int count=0;
    while(n!=0){
        if(n&1){
            count+=1;
        }
        n=n>>1;
    }
    if(count==1){
        return 1;
    }
    return 0;
}

int main()
{
    int n;
    cout<<"Enter a number: ";
    cin>>n;
    if(isPow(n)){
        cout<<"The number is power of two.";
    }
    else cout<<"NOT a power of two.";
    return 0;
}