/*
A
BC
CDE
DEFG
EFGHI*/
#include<iostream>
using namespace std;

int main()
{
    int n;
    cout<<"Enter number:";
    cin>>n;
    int i=1;

    while(i<=n){
        int j=1;
        char ch='A'+i-1;
        while(j<=i){
            cout<<ch;
            ch+=1;
            j+=1;
        }
        cout<<endl;
        i+=1;
    }
    return 0;
}

//char ch='A'+row+col-2
//cout<<ch