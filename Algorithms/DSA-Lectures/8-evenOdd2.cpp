#include<iostream>
using namespace std;

bool isEven(int num){
    if(num&1){
        return 0;
    }
    return 1;
}

int main()
{
    int n;
    cout<<"Enter a number: ";
    cin>>n;
    if(isEven(n)){
        cout<<endl<<"Number is Even";
    }
    else  cout<<endl<<"Number is Odd";
}